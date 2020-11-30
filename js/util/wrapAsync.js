export default function wrapAsync(val) {
    if (val) {
        if (val.exec) return val.exec();
        if (val.then) return val;
    }
    return Promise.resolve(val);
}