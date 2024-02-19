class ObjectUtil {
    deep_copy(val) {
        return JSON.parse(JSON.stringify(val));
    }
}

export default new ObjectUtil()