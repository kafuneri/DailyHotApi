import type { RouterData } from "../types.js";
import type { RouterType } from "../router.types.js";
import { get } from "../utils/getData.js";
import { getTime } from "../utils/getTime.js";

export const handleRoute = async (_: undefined, noCache: boolean) => {
  const listData = await getList(noCache);
  const routeData: RouterData = {
    name: "weibo",
    title: "微博",
    type: "热搜榜",
    description: "实时热点，每分钟更新一次",
    link: "https://s.weibo.com/top/summary/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (noCache: boolean) => {
  const url = `https://weibo.com/ajax/side/hotSearch`;
  const result = await get({ url, noCache, ttl: 60 });
  const list = result.data.data.realtime;
  return {
    ...result,
    data: list.map((v: RouterType["weibo"]) => {
      const key = v.word_scheme ? v.word_scheme : `#${v.word}`;
      return {
        id: v.mid,
        title: v.word,
        desc: v.note || key,
        author: v.flag_desc,
        timestamp: getTime(v.onboard_time),
        hot: v.num,
        url: `https://s.weibo.com/weibo?q=${encodeURIComponent(key)}&t=31&band_rank=1&Refer=top`,
        mobileUrl: `https://s.weibo.com/weibo?q=${encodeURIComponent(
          key,
        )}&t=31&band_rank=1&Refer=top`,
      };
    }),
  };
};
