import constants from "~/utils/constants.json"
export default ($axios) => {
    return {
        helloWorld(){
            return constants.HELLO_WORLD
        },
    }
}