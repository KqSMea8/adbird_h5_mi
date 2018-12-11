module.exports = class MathUtils {

    static float(val) {
        let ret = parseFloat(val);
        if (isNaN(ret)) {
            ret = 0.0
        }
        return ret;
    }

}