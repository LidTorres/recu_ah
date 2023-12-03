import yup from 'yup';

export const votoCreateSchema = yup.object({
    Jugabilidad: yup.number().min(1).max(10, '1 a 10').required("requerido"),
    Arte: yup.number().min(1).max(10, '1 a 10').required("requerido"),
    Sonido: yup.number().min(1).max(10, '1 a 10').required("requerido"),
    Tematica: yup.number().min(1).max(10, '1 a 10').required("requerido"),
});
