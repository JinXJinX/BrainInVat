import { defineStore } from "pinia";
import { BotType, PageMetaData } from "../types"

export const useAppStore = defineStore({
    id: "app",
    state: () => {
        return {
            botType: BotType.PAGE,
            currPageMeta: null as PageMetaData | null,
            selectedPageLink: null as string | null,
            // pages: [] as PageData[],
            key: null as string | null,
        };
    },
    getters: {
        isPageBot(): boolean {
            return this.botType === BotType.PAGE
        },
        isTempPageBot(): boolean {
            return this.botType === BotType.TEMP_PAGE
        },
        isDBBot(): boolean {
            return this.botType === BotType.DB
        },
        // currPage: (state) => {
        //     if (!state.currPageMeta) return null
        //     const rst = state.pages.filter(p => p.link === state.currPageMeta?.link)
        //     return rst.length > 0 ? rst[0] : null
        // },
    },
    actions: {
        setBotType(val: BotType) {
            this.botType = val
        },
        setPageMeta(val: PageMetaData | null) {
            this.currPageMeta = val
        },
        // addPageData(dataList: PageData[]) {
        //     const links: string[] = this.pages.map(p => p.link)
        //     const pages = [
        //         ...this.pages,
        //     ]
        //     for (let i = 0; i < dataList.length; i++) {
        //         const page = dataList[i]
        //         if (links.indexOf(page.link) === -1) {
        //             pages.push(page)
        //         }
        //     }
        //     this.pages = pages
        // },
        setKey(val: string) {
            this.key = val
        },
        selectPageLink(val: string | null) {
            this.selectedPageLink = val
        },
    },
});
