import {createStore} from 'vuex'
import AccessModule from "@/store/modules/access.module";
import ImageModule from "@/store/modules/image.module";
import VoteModule from "@/store/modules/vote.module";

export default createStore({
    state: {
        API: 'https://backvoter.is57.ru/',
        domain: 'https://photovote.is57.ru/'
    },
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        AccessModule: AccessModule,
        ImageModule: ImageModule,
        VoteModule: VoteModule
    }
})
