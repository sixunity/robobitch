const cuteEmoticons = [
  'ʕ•ᴥ•ʔ',
  'ʕʘ̅͜ʘ̅ʔ',
  'ʕっ•ᴥ•ʔっ',
  '(｡♥‿♥｡)',
  '(◕‿◕)',
  '(◠‿◠)',
  '(^.^)',
  '(^̮^)',
  '(>‿◠)',
  '(✿ ♥‿♥)',
  '(｡♥‿♥｡)',
  '(≧◡≦)',
  '(*^_^*)',
  '(^.^)',
  '(✿◠‿◠)',
  '(^◕‿◕^)',
  '（*＾3＾)/~☆',
  '(=^-ω-^=)',
  'ヽ(＾Д＾)ﾉ',
  '(*￣(ｴ)￣*)',
  '(´｡• ω •｡`)',
  'ヽ(｡◕‿◕｡)ﾉ',
  'ヾ(＾-＾)ノ',
  '(≧ω≦)',
  '(^人^)',
  '(>ω<)',
  '(*^.^*)',
  '(o^▽^o)',
  '（*＾3＾)/~☆',
  '(●´ω｀●)',
  '(^_−)☆'];
  
  function getRandomCuteEmoticon() {
  const randomIndex = Math.floor(Math.random() * cuteEmoticons.length);
  return cuteEmoticons[randomIndex];
}

module.exports = {
 getRandomCuteEmoticon,
};
