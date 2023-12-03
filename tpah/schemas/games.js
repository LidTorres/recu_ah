import yup from 'yup';

export const gameCreateSchema = yup.object({
    name: yup.string("poner palabras").required("requerido"),
    genre: yup.string("poner palabras").required(" requerido"),
    desa: yup.string("poner palabras"),
    edition: yup.number("poner año").required("requerido")
});

export const gameUpdateSchema = yup.object({
    name: yup.string("poner palabras"),
    genre: yup.string("poner palabras"),
    desa: yup.string("poner palabras"),
    edition: yup.number("poner año")
});