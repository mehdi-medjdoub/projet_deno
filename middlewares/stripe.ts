import axiod from "https://deno.land/x/axiod/mod.ts";
import { isValidLength, numberFormat } from "./index.ts";
import { config } from '../config/config.ts';
import UserInterfaces from "../interfaces/UserInterfaces.ts";
import { cardTypes } from "../types/cardTypes.ts";

const {
    STRIPE_SECRET_KEY,
    STRIPE_PUBLIC_KEY
} = config;



/**
 *  Add customer stripe
 */ 
export const addCustomerStripe = async(email: string, fullName: string) => {
    let payload: any = {
        "email": email,
        "name": fullName,
    };
    const dataBody = convertToFormBody(payload);
    return await axiod("https://api.stripe.com/v1/customers", getConfigAxiod('post', dataBody))// return cus_...
}

/**
 *  Update customer with card token (secure) stripe
 */ 
export const updateCustomerCardStripe = async(idCustomer: string | undefined , idCard: string) => {
    if(idCustomer === undefined || idCustomer === null) return;
    let payload: any = {
        'source' : idCard
    };
    const dataBody = convertToFormBody(payload);
    return await axiod(`https://api.stripe.com/v1/customers/${idCustomer}/sources`, getConfigAxiod('post', dataBody))// return src_...
}

/**
 *  Ajout du produit stripe
 */ 
export const addProductStripe = async(name: string, description: string, unitAmount: number = 500, currency: string = 'eur') => {
    let payload: any = {
        name: name,
        description: description
    };
    const dataBody = convertToFormBody(payload);
    const responseAddProduct = await axiod(`https://api.stripe.com/v1/products`, getConfigAxiod('post', dataBody))
    return await addPriceProductStripe(responseAddProduct.data.id, unitAmount, currency);
}

/**
 *  Ajout du price sur un produit
 */ 
const addPriceProductStripe = async(idProduct: string, unitAmount: number = 500, currency: string = 'eur') => {
    let payload: any = {
        "product": idProduct,
        "currency": currency.toLowerCase(),
        "unit_amount": unitAmount < 0 ? 500 : unitAmount,// equivalent a 500 centimes soit 5.00 Euros
        "billing_scheme": "per_unit",
        "recurring[interval]":"month",
        "recurring[interval_count]":"1",
        "recurring[trial_period_days]":"0",
        "recurring[usage_type]":"licensed"
        //"unit_amount_decimal": unitAmount < 0 ? String(500) : String(unitAmount),
    };
    const dataBody = convertToFormBody(payload);
    return await axiod(`https://api.stripe.com/v1/prices`, getConfigAxiod('post', dataBody))
}

/**
 *  Payment abonnement au produit
 */ 
export const paymentStripe = async(idCustomer: string | undefined, idPrice: string, quantity: number = 1): Promise<any>=> {
    return new Promise(async(resolve, reject) => {
        if(idCustomer === null || idCustomer === undefined){
            reject();
        }else{
            let payload: any = {
                "customer": idCustomer,
                "off_session": String(true),
                "collection_method": "charge_automatically",
                "items[0][price]": idPrice,
                "items[0][quantity]": String(quantity),
                "enable_incomplete_payments": String(false) // Champ a vérifier et confirmer
            };
            const dataBody = convertToFormBody(payload);
            await axiod(`https://api.stripe.com/v1/subscriptions`, getConfigAxiod('post', dataBody))
                .then((data) => {
                    resolve(data)//return sub_...
                }).catch((error) => {
                    reject(error)
                })
        }        
    });
}

/**
 *  Récupération des données du client Stripe
 */ 
export const getCustomerStripe = async(idCustomer: string) => {
    return await axiod(`https://api.stripe.com/v1/customers/${idCustomer}`, getConfigAxiod('get'))
}

/**
 *  Function get all cards from customer
 *  @param idCard idCard
 */ 
export const getAllCardsCustomerStripe = async(idCustomer: string | undefined) => {
    if(idCustomer === null || idCustomer === undefined) return { data: {} };
    return await axiod(`https://api.stripe.com/v1/customers/${idCustomer}/sources?object=card`, getConfigAxiod('get'))
}

/**
 *  Modifier les données clients Stripe
 */ 
export const updateCustomerStripe = async(idCustomer: string | undefined, data: any, user: UserInterfaces): Promise<any>=> {
    return new Promise(async(resolve, reject) => {
        if(idCustomer === null || idCustomer === undefined){
            reject();
        }else{
            let payload: any = { 
                "email": user.email,
                "name": data.firstname+' '+data.lastname,  
            };
            const dataBody = convertToFormBody(payload);
            await axiod(`https://api.stripe.com/v1/customers/${idCustomer}`, getConfigAxiod('post', dataBody))
                .then((data) => {
                    resolve(data)
                }).catch((error) => {
                    reject(error)
                })
        }
    });
}

/**
 *  Supprimer le clients Stripe
 */ 
export const deleteCustomerStripe = async(idCustomer: string | undefined): Promise<any>=> {
    return new Promise(async(resolve, reject) => {
        if(idCustomer === null || idCustomer === undefined){
            reject();
        }else{
            await axiod(`https://api.stripe.com/v1/customers/${idCustomer}`, getConfigAxiod('delete'))
                .then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error)
                })
        }
    });
}

/**
 *  Function get one card from customer
 *  @param idCustomer idCustomer
 *  @param idCard idCard
 */ 
export const getCardCustomerStripe = async(idCustomer: string, idCard: string) => {
    return await axiod(`https://api.stripe.com/v1/customers/${idCustomer}/sources/${idCard}`, getConfigAxiod('get'))
}

/**
 *  Function to detach a source card from customer
 *  @param idCustomer idCustomer
 *  @param idCard idCard
 */ 
export const detachCardCustomerStripe = async(idCustomer: string, idCard: string) => {
    return await axiod(`https://api.stripe.com/v1/customers/${idCustomer}/sources/${idCard}`, getConfigAxiod('delete'))
}

/**
 *  Check si la carte existe deja ou pas (true = existe deja et false = n'existe pas)
 */ 

/**
 *  Check conformité sub card (true = fail et false = success)
 */ 
export const checkIsNonConformeSub = (data: any): boolean => {
    if(!isValidLength(data.cvc, 3, 3) || !isValidLength(data.id, 1, 10)){
        return true;//fail
    }else{
        const isNegative: boolean = parseInt(data.cvc) < 0 || parseInt(data.id) < 0 ? true : false;
        const isNotNumber: boolean = !numberFormat(data.id) || !numberFormat(data.cvc) ? true : false ;
        if(isNegative || isNotNumber){
            return true;//fail
        }else{
            return false;//success
        }
    }
}



/**
 *  Request config 
 *  @param methodReq post / get / put / delete ...
 *  @param dataBody? data from body
 */ 
const getConfigAxiod = (methodReq: string, dataBody: any = null) => {
    const configAxiod = {
        method: methodReq.trim().toLowerCase(),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`, 
        },
        data: dataBody
    };
    dataBody === null ? delete configAxiod.data : null;
    return configAxiod;
}

/**
 *  Conversion to form body
 */ 
const convertToFormBody = (data: any) => {
    let formBody: any = [];
    for (let property in data) {
        //cardDetails.hasOwnProperty(property)
        formBody.push(encodeURIComponent(property) + '=' + encodeURIComponent(data[property]));
    }
    return formBody.join("&");
}

/**
 *  Conversion to UrlEncoded
 */ 
const toUrlEncoded = (obj: any) => Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');

/**
 *  Conversion to form data
 */ 
const getFormData = (object: any) => {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}