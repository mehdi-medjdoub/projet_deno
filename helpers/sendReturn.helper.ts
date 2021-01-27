export const sendReturn = (
    res:any,
    status = 500,
    data =
        {
            error: true,
            message: "Processing error"
        }
) => {
    //res.setHeader("Content-Type", "application/json"); // Typage de la data de retour
    res.type("json");
    res.setStatus(status).json(data);
};

