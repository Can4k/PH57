import axios from "axios";
import WarningController from "@/plagins/WarningController";


export default {
    namespaced: true,
    state: {
        TagsList: null,
        API_MAP: {
            GetAllPhotoTags: 'voter/tags',
            GetPhotos: 'voter/photos',
            GetPhotosTags: 'voter/photos/tags',
            GetPhoto: 'voter/photo',
            GetWiningStats: 'voter/photos/stats'
        }
    },

    mutations: {
        UpdateTagsList(state, val) {
            state.TagsList = val;
        }
    },

    actions: {
        async GetAllPhotoTags(context) {
            let url = context.rootState.API + context.state.API_MAP.GetAllPhotoTags;

            let res = null;
            try {
                res = await axios.get(url);
                context.commit('UpdateTagsList', res.data.tags);
            } catch (e) {
                WarningController.error('При запросе списка тегов произошла ошибка');
            }

            return res ?? [];
        },

        async GetPhotos(context, params) {
            let url = context.rootState.API + context.state.API_MAP.GetPhotos;

            let {offset, limit, tags} = params ?? {};
            offset ??= 1;
            url += `?offset=${offset}&`

            limit ??= 20;
            url += `limit=${limit}`

            if (tags) {
                tags = tags.join(',');
                url += `&tags=${tags}`;
            }

            let res = {};
            try {
                res = await fetch(url);
                return res;
            } catch (e) {
                WarningController.error('При запросе фотографий произошла ошибка');
                return null;
            }
        },

        async GetPhotosTags(context, params) {
            let url = context.rootState.API + context.state.API_MAP.GetPhotosTags;

            let {offset, limit, tags} = params ?? {};
            offset ??= 1;
            url += `?offset=${offset}&`

            limit ??= 20;
            url += `limit=${limit}`

            if (tags) {
                tags = tags.join(',');
                url += `&tags=${tags}`;
            }

            let res = {};
            try {
                res = await axios.get(url);
                return res.data.Photos;
            } catch (e) {
                WarningController.error('При запросе списка тегов фотографий произошла ошибка');
                return null;
            }
        },

        async GetPhoto(context, params) {
            const {id} = params;
            const url = context.rootState.API + context.state.API_MAP.GetPhoto + `?id=${id}`;
            try {
                const res = await axios.get(url);
                return res.data;
            } catch (e) {
                WarningController.error('При запросе полной версии фотографии произошла ошибка');
                return null;
            }
        },

        async GetWiningStats(context) {
            const url = context.rootState.API + context.state.API_MAP.GetWiningStats;
            try {
                const res = await axios.get(url);
                let DataArr = res.data;
                if (!Array.isArray(DataArr)) {
                    throw 'invalid type'
                }

                const DataSet = {};
                DataArr.forEach((item, index) => {
                    DataSet[item.id] = {Votes: item.votes_count};

                })

                return DataSet;
            } catch (e) {
                WarningController.error('При запросе результатов произошла ошибка');
                return null;
            }
        }
    }
}