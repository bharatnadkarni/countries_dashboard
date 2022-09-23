import Services from "~/services/services"
export default ({$axios}, inject) => {
    inject("services", Services($axios))
}