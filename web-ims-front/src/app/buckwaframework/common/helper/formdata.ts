export var toFormData = (item: any) => {
    let form_data = new FormData();
    for (let key in item) {
        form_data.append(key, item[key]);
    }
    return form_data;
}

export default { toFormData };