import axios from "axios";
import oauthModule from "@/modules/oauth.module";
import WarningController from "@/plagins/WarningController";

export default {
    namespaced: true,
    state: {
        API_MAP: {
            GetGmailDataByAccess: "https://www.googleapis.com/oauth2/v1/userinfo?access_token=",
            SignOut: "https://oauth2.googleapis.com/revoke?token=",
        },

        Account: null
    },

    mutations: {
        UpdateAccount(state, params) {
            const {access_token, NewAccount} = params;
            state.Account = NewAccount;
            state.Account.access_token = access_token;
            localStorage.access_token = access_token;
        },

        clearAccount(state) {
            localStorage.removeItem('access_token');
            state.Account = null;
        }
    },

    actions: {
        clearAllAccountData(context) {
            context.commit('clearAccount');
            context.commit('VoteModule/updatePickedPhotoId', -1, {root: true});
        },

        async GetGmailDataByAccess(context, params) {
            const {access_token} = params;

            const url = context.state.API_MAP.GetGmailDataByAccess + access_token;

            let res = {};
            try {
                res = await axios.get(url);
                const {email} = res.body;

                if (!oauthModule.verifyEmail(email)) {
                    await context.dispatch('clearAllAccountData');
                    WarningController.error('Вы не можете войти не по школьной почте');
                    return {};
                }

                context.commit('UpdateAccount', {
                    NewAccount: res.data,
                    access_token
                });

                await context.dispatch('VoteModule/GetVote', null, {root: true});

                WarningController.success(`Вы вошли как ${res.data.email}`);
            } catch (e) {
                await context.dispatch('clearAllAccountData');
                WarningController.error('Не удалось авторизоваться');
            }

            return res;
        },

        async SignOut(context){
            const url = context.state.API_MAP.SignOut + context.state.Account.access_token;
            try {
                const res = await axios(url, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    }
                });

                if (res.status === 200) {
                    await context.dispatch('clearAllAccountData');
                    return true;
                }

                throw new Error();
            } catch (e) {
                WarningController.error('При попытке выйти произошла ошибка');
                return false;
            }
        }
    }
}