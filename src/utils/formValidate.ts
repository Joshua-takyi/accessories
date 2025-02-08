import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";


export const Validator = (schema) => {
    return useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });
};