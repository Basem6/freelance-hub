export const handleChange = (e , setData) => {
    const { name, value } = e.target;

    setData((prev) => ({
    ...prev,
    [name]: value,
    }));
};