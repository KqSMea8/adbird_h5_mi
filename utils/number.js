module.exports = class MathUtils {

    static float(val) {
        let ret = parseFloat(val);
        if (isNaN(ret)) {
            ret = 0.0
        }
        return ret;
    }

    static int(val) {
        let ret = parseInt(val, 10);
        if (isNaN(ret)) {
            ret = 0.0
        }
        return ret;
    }

}