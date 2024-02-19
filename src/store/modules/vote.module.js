import WarningController from "@/plagins/WarningController";
import axios from "axios";

export default {
    namespaced: true,

    state: {
        API_MAP: {
            GetVote: 'voter/votes/who?token=',
            MakeVoteRequest: 'voter/votes/add'
        },

        pickedPhotoId: null,
    },

    mutations: {
        updatePickedPhotoId(state, value) {
            state.pickedPhotoId = value;
        }
    },

    actions: {
        async GetVote(context) {
            const access_token = context.rootState.AccessModule.Account?.access_token;
            if (!access_token) {
                WarningController.error('Невозможно узнать ваш голос, поскольку вы не вошли в систему');
                return null;
            }

            const url = context.rootState.API + context.state.API_MAP.GetVote + access_token;
            try {
                const res = await axios.get(url);
                context.commit('updatePickedPhotoId', res.data);
                return res.data;
            } catch (e) {
                WarningController.error('При попытке узнать ваш голос произошла ошибка');
            }
        },

        async MakeVoteRequest(context, params) {
            const access_token = context.rootState.AccessModule.Account?.access_token;

            const {id, delta} = params;
            let url = context.rootState.API + context.state.API_MAP.MakeVoteRequest;
            const body = {
                session: access_token,
                photoId: id,
                delta
            }

            await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'no-cors'
            });
        },

        async MakeVote(context, params) {
            const access_token = context.rootState.AccessModule.Account?.access_token;
            if (!access_token) {
                WarningController.error('Невозможно проголосовать, поскольку вы не вошли в систему');
                return null;
            }

            await context.dispatch('GetVote');

            // Отмена голоса
            const {id} = params;
            if (id === context.state.pickedPhotoId) {
                await context.dispatch('MakeVoteRequest', {
                    id,
                    delta: -1
                });

                await context.dispatch('GetVote');
                if (context.state.pickedPhotoId === -1) {
                    WarningController.success('Голос отменен');
                    return true
                }

                WarningController.error('При попытке отмены голоса произошла ошибка');
                return false;
            }

            // Чистый голос
            if (context.state.pickedPhotoId === -1) {
                await context.dispatch('MakeVoteRequest', {
                    id,
                    delta: 1,
                });

                await context.dispatch('GetVote');

                if (context.state.pickedPhotoId === id) {
                    WarningController.success('Голос зачтен');
                    return true
                }

                WarningController.error('При попытке зачесть голос произошла ошибка');
                return false;
            }

            // Голос за другую фотографию
            if (context.state.pickedPhotoId !== -1) {
                await context.dispatch('MakeVoteRequest', {
                    id: context.state.pickedPhotoId,
                    delta: -1,
                });

                await context.dispatch('MakeVoteRequest', {
                    id,
                    delta: 1,
                });

                await context.dispatch('GetVote');

                if (context.state.pickedPhotoId === id) {
                    WarningController.success('Голос изменен');
                    return true
                }

                WarningController.error('При попытке изменить голос произошла ошибка');
                return false;
            }
        },
    },
}