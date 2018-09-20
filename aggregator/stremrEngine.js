require('newrelic');
let Parser = require('rss-parser');
let parser = new Parser();
const extract = require('meta-extractor');
var keyword_extractor = require("keyword-extractor");
var fs = require("fs");
var _ = require('underscore');
const fetch = require('node-fetch'); 
const {
  performance
} = require('perf_hooks');

Array.prototype.removeIf = function(str) {
  var i = this.length;
  while (i--) {
    if (this[i] === str) {
        this.splice(i, 1);
    }
  }
};

const remove_duplicates = (arr) => {
  let s = new Set(arr);
  let it = s.values();
  return Array.from(it);
}

const checkBias = (provider) => {
  const bias = [];
  bias['AP'] = 0;
  bias['CNN'] = -1.5;
  bias['Fox'] = 3;
  bias['MSNBC'] = -2;
  bias['Axios'] = -1;
  bias['Reuters'] = 0;
  bias['bias'] = -2;
  bias['ABC'] = -1;
  bias['CBS'] = -1;
  bias['CNBC'] = -1;
  bias['The Hill'] = 1;
  bias['USA Today'] = 0;
  bias['CBC'] = 0;
  bias['Washington Post'] = -.5;
  bias['Politico'] = -.5;

  if (bias[provider] != null){
    return bias[provider];
  }else{
    return 0;
  }
}

const returnDupes = (arr) => {
  results = arr.filter(function(itm, i){
      return arr.lastIndexOf(itm)== i && arr.indexOf(itm)!= i;
  });
  return results;
}

var findCommonElements = function(arrs) {
  var resArr = [];
  for (var i = arrs[0].length - 1; i > 0; i--) {
      for (var j = arrs.length - 1; j > 0; j--) {
          if (arrs[j].indexOf(arrs[0][i]) == -1) {
              break;
          }
      }
      if (j === 0) {
          resArr.push(arrs[0][i]);
      }
  }
  return resArr;
}

function similarityNum(arrayA, arrayB) {
  let intC = _.intersection(arrayA,arrayB).length;

  console.log(intC + "//" + (arrayA.length+arrayB.length));
  console.log(intC/(arrayA.length+arrayB.length));

  return intC/(arrayA.length+arrayB.length);
}

const diceCoefficient = (l, r) => {
  if (l.length < 2 || r.length < 2) return 0;

  let lBigrams = new Map();
  for (let i = 0; i < l.length - 1; i++) {
    const bigram = l.substr(i, 2);
    const count = lBigrams.has(bigram)
      ? lBigrams.get(bigram) + 1
      : 1;

    lBigrams.set(bigram, count);
  };

  let intersectionSize = 0;
  for (let i = 0; i < r.length - 1; i++) {
    const bigram = r.substr(i, 2);
    const count = lBigrams.has(bigram)
      ? lBigrams.get(bigram)
      : 0;

    if (count > 0) {
      lBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (l.length + r.length - 2);
}

async function loopRSSFeed (item, provider) {
  return new Promise((resolve, reject) => {
    var result = new Object();

    result.title = item.title.trim();
    result.provider = provider;
    result.link = item.link.trim();
    //console.log(item);

    if (item.link == null){
      reject("Could not access link.");
    }else{
      extract({ uri: result.link })
      .then(res => {
        var cleanStr = '';
        if (typeof res.ogDescription != 'undefined')
        {
          cleanStr += res.ogDescription.trim() + ' ';
        }

        cleanStr += result.title;
        
        if (cleanStr === '')
        {
          reject("No description or title detected.")
        }

        result.tags = keyword_extractor.extract(cleanStr,{
          language:"english",
          remove_digits: false,
          return_changed_case:true,
          remove_duplicates: true
        });

        result.tags.removeIf('-');
        result.tags.removeIf('—');
        result.tags.removeIf("--");
        result.tags.removeIf("ap");
        result.tags.removeIf("cnn video");
        result.tags.removeIf("|");
        result.tags.removeIf("donald");
        result.tags.removeIf("trump");
        result.tags.removeIf("latest");
        result.tags.removeIf("washington");
        result.tags.removeIf("set");
        result.tags.removeIf("week");
        result.tags.removeIf("watch");
        result.tags.removeIf("white");
        result.tags.removeIf("house");
        result.tags.removeIf("year");
        result.tags.removeIf("day");
        result.tags.removeIf("month");
        result.tags.removeIf("candidate");
        result.tags.removeIf("candidates");

        result.cleanedCompare = result.tags.join(' ');

        console.log('---------------------+Metadata+---------------------');
        console.log("Getting additional info for:" + result.link);
        console.log(result.cleanedCompare);
        
        console.log('----------------------------------------------------');

        result.metadata = res;

        resolve(result)
      }).catch(err => {console.error(err)
        console.log(err);
        resolve(result);
      });
    }
  });
};

async function getRssFeedContent(url, provider) {
  return new Promise((resolve, reject) => {
    x = 0;
    (async () => {
      console.log('...Starting ' + provider + '...');
      let feed = await parser.parseURL(url);
      let len = feed.items.length;
      if (len > 10){
        len = 10;
      }
      let fillArr = [];
      //console.log(feed.items.length);
      for (let i=0; i < len; i++){
        try{
          let loopPromise = await loopRSSFeed(feed.items[i], provider);
          if (loopPromise != null){
            fillArr.push(loopPromise);
          }
        }catch(error){
          console.log(error);
        }
      }
      console.log('...Ending ' + provider + '...');
      resolve(fillArr);
    })();
  });
};

//So far just for AP - they don't have RSS
async function getJsonFeedContent(url, provider) {
  return new Promise((resolve, reject) => {
    fetch(url).then(res => res.text()).then(body => {
      (async () => {
        console.log('...Starting ' + provider + '...');
        let json = JSON.parse(body);
        let fillArr = [];

        for (let i=0; i < json.cards.length; i++){
          try{
          var jsonObj = new Object();
            jsonObj.title = json.cards[i].contents[0].headline;
            jsonObj.link = json.cards[i].contents[0].localLinkUrl;
            if (jsonObj.link != null){
              let loopPromise = await loopRSSFeed(jsonObj, provider);
              fillArr.push(loopPromise);
            }
          }catch(error){
            console.log(error);
          }
        }
        console.log('...Ending ' + provider + '...');
        resolve(fillArr);
      })();
    });
  });
};

const buildSArticleListObj = function (arr, variance) {
  let builtArr = [], usedElem = [];

  for (let i = 0; i<arr.length; i++){
    let currNode = [];
    let tagsList = [];
    let bias = 0;
    if (usedElem.indexOf(i) == -1){
      let elem = arr[i];
      currNode.push(elem);
      bias += checkBias(elem.provider);
      tagsList = tagsList.concat(elem.tags);

      console.log('--------------+Searching for Similar+--------------');
      console.log(elem.title + ' (' + elem.provider + ')');
      console.log(elem.cleanedCompare);
      console.log(elem.link);
      console.log('---------------------------------------------------');

      for (let j = 0; j<arr.length; j++){
        let compare = arr[j];
        if (i !== j && usedElem.indexOf(j) == -1 && currNode.indexOf(compare) == -1){
          try{
            let threshold = similarityNum(elem.tags, compare.tags);
            if (threshold > variance)
            {
              console.log('--------------+Found Similar ('+ threshold +')+----------------');
              console.log(threshold)
              console.log(compare.title + ' (' + compare.provider + ')');
              console.log(compare.cleanedCompare);
              console.log(compare.link);
              compare.threshold = threshold;
              //console.log(compare.summary.join("\n"));
              console.log('---------------------------------------------------');

              usedElem.push(j);
              currNode.push(compare);
              tagsList = tagsList.concat(compare.tags);
              bias += checkBias(compare.provider);       
            }
          }catch(error){
            console.log("Could not compare: " + error);
          }
        }
      }
    }
    if (currNode.length > 1){
      var obj = {
        combinedTags: tagsList,
        bias: ((bias === 0) ? 0 : bias/currNode.length),
        commentTags: findCommonElements(tagsList),
        //providers: [],
        nodes: currNode
      }
      builtArr.push(obj);
    }
  }
  builtArr.sort((a, b) => b.nodes.length - a.nodes.length);

  return builtArr;
}

async function createJSON(list, name, variance) {
  var a = performance.now(), mergeList = [];

  for (let i = 0; i<list.length; i++){
    try {     
      var results = [];
      if (list[i].provider == 'AP'){
        results = await getJsonFeedContent(list[i].link, list[i].provider);
      }else{
        results = await getRssFeedContent(list[i].link, list[i].provider);
      }
      mergeList = mergeList.concat(results);
    }catch (error) {
      console.log(error.message);
    }
  }

  let builtObj = buildSArticleListObj(mergeList, variance);
  var path = __dirname + '/../webserver/JSON/';
  fs.writeFile(path + name, JSON.stringify(builtObj), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("---" + name + " File has been created---");
  });

  var b = performance.now();
  var ms = (b - a), min = Math.floor((ms/1000/60) << 0), sec = Math.floor((ms/1000) % 60);
  console.log("Time: " + min + ':' + sec);
}

(async () => {
  let topNewsArr = [
    {'link': 'https://afs-prod.appspot.com/api/v2/feed/tag?tags=apf-topnews', 'provider': 'AP'},
    {'link': 'http://rss.cnn.com/rss/cnn_topstories.rss', 'provider': 'CNN'},
    {'link': 'http://feeds.foxnews.com/foxnews/latest', 'provider': 'Fox'},
    {'link': 'https://api.axios.com/feed/', 'provider': 'Axios'},
    {'link': 'http://feeds.reuters.com/reuters/topNews', 'provider': 'Reuters'},
    {'link': 'http://www.msnbc.com/feeds/latest', 'provider': 'MSNBC'},
    {'link': 'https://abcnews.go.com/abcnews/topstories', 'provider': 'ABC'},
    {'link': 'https://www.cbsnews.com/latest/rss/main', 'provider': 'CBS'},
    {'link': 'https://www.cnbc.com/id/100003114/device/rss/rss.html', 'provider': 'CNBC'},
    {'link': 'http://thehill.com/rss/syndicator/19110', 'provider': 'The Hill'},
    {'link': 'http://rssfeeds.usatoday.com/usatoday-newstopstories&x=1', 'provider': 'USA Today'},
    {'link': 'http://www.cbc.ca/cmlink/rss-topstories', 'provider': 'CBC'}
  ];

  createJSON(topNewsArr, 'topNews.json', 0.05);
    
  let usNewsArr = [
    {'link': 'https://afs-prod.appspot.com/api/v2/feed/tag?tags=apf-usnews', 'provider': 'AP'},
    {'link': 'http://rss.cnn.com/rss/cnn_us.rss', 'provider': 'CNN'},
    {'link': 'http://feeds.foxnews.com/foxnews/national', 'provider':'Fox'},
    {'link': 'https://www.cnbc.com/id/15837362/device/rss/rss.html', 'provider': 'CNBC'},
    {'link': 'https://abcnews.go.com/abcnews/usheadlines', 'provider': 'ABC'},
    {'link': 'http://feeds.reuters.com/Reuters/domesticNews', 'provider': 'Reuters'},
    {'link': 'https://www.cbsnews.com/latest/rss/us', 'provider': 'CBS'},
    {'link': 'http://rssfeeds.usatoday.com/usatodaycomnation-topstories&x=1', 'provider': 'USA Today'},
    {'link': 'http://feeds.washingtonpost.com/rss/national', 'provider': 'Washington Post'},
    {'link': 'http://rss.nytimes.com/services/xml/rss/nyt/US.xml', 'provider': 'NY Times'}
  ];

  createJSON(usNewsArr, 'usNews.json', 0.08);

  let politicsArr = [
    {'link': 'https://afs-prod.appspot.com/api/v2/feed/tag?tags=apf-politics', 'provider': 'AP'},
    {'link': 'http://rss.cnn.com/rss/cnn_allpolitics.rss', 'provider': 'CNN'},
    {'link': 'http://feeds.foxnews.com/foxnews/politics', 'provider': 'Fox'},
    {'link': 'https://api.axios.com/feed/politics', 'provider': 'Axios'},
    {'link': 'https://www.politico.com/rss/politics08.xml', 'provider': 'Politico'},
    {'link': 'http://feeds.washingtonpost.com/rss/politics', 'provider': 'Washington Post'},
    {'link': 'https://www.nationalreview.com/feed/', 'provider': 'National Review'},
    {'link': 'https://www.cnbc.com/id/10000113/device/rss/rss.html', 'provider': 'CNBC'},
    {'link': 'https://abcnews.go.com/abcnews/politicsheadlines', 'provider': 'ABC'},
    {'link': 'http://feeds.reuters.com/Reuters/PoliticsNews', 'provider': 'Reuters'},
    {'link': 'https://www.cbsnews.com/latest/rss/politics', 'provider': 'CBS'},
    {'link': 'http://rssfeeds.usatoday.com/usatodaycomwashington-topstories&x=1', 'provider': 'USA Today'}
  ];

  createJSON(politicsArr, 'politics.json', 0.08);

  let worldArr = [
    {'link': 'https://afs-prod.appspot.com/api/v2/feed/tag?tags=apf-intlnews', 'provider': 'AP'},
    {'link': 'http://feeds.bbci.co.uk/news/world/rss.xml', 'provider': 'BBC'},
    {'link': 'https://www.huffingtonpost.com/section/world-news/feed', 'provider': 'HuffPo'},
    {'link': 'http://feeds.reuters.com/Reuters/WorldNews', 'provider': 'Reuters'},
    {'link': 'http://www.cbc.ca/cmlink/rss-world', 'provider': 'CBC'},
    {'link': 'http://rss.cnn.com/rss/cnn_world.rss', 'provider': 'CNN'},
    {'link': 'http://feeds.foxnews.com/foxnews/world', 'provider': 'Fox'},
    {'link': 'https://api.axios.com/feed/world', 'provider': 'Axios'},
    {'link': 'http://feeds.washingtonpost.com/rss/world', 'provider': 'Washington Post'},
    {'link': 'https://www.cnbc.com/id/100727362/device/rss/rss.html', 'provider': 'CNBC'},
    {'link': 'https://abcnews.go.com/abcnews/internationalheadlines', 'provider': 'ABC'},
    {'link': 'https://www.cbsnews.com/latest/rss/world', 'provider': 'CBS'},
    {'link': 'http://rssfeeds.usatoday.com/UsatodaycomWorld-TopStories', 'provider': 'USA Today'}
  ];

  createJSON(worldArr, 'world.json', 0.08);

  let sportsArr = [
    {'link': 'http://www.espn.com/espn/rss/news', 'provider': 'ESPN'},
    {'link': 'http://www.si.com/rss/si_topstories.rss', 'provider': 'SI'},
    {'link': 'https://api.foxsports.com/v1/rss?partnerKey=zBaFxRyGKCfxBagJG9b8pqLyndmvo7UU', 'provider': 'FoxSports'},
    {'link': 'http://feeds.feedburner.com/sportsblogs/sbnation.xml', 'provider': 'SBNation'},
    {'link': 'https://rss.cbssports.com/rss/headlines/', 'provider': 'CBSSports'},
    {'link': 'https://rss.cbssports.com/rss/headlines/', 'provider': 'CNNSports'},
    {'link': 'https://sports.yahoo.com/rss/', 'provider': 'Yahoo'},
    {'link': 'http://rssfeeds.usatoday.com/usatodaycomsports-topstories&x=1', 'provider': 'USA Today'}
  ];

  createJSON(sportsArr, 'sports.json', 0.08);

  // let techArr = [
  //   {'link': 'http://www.espn.com/espn/rss/news', 'provider': 'ESPN'},
  //   {'link': 'http://www.si.com/rss/si_topstories.rss', 'provider': 'SI'},
  //   {'link': 'https://api.foxsports.com/v1/rss?partnerKey=zBaFxRyGKCfxBagJG9b8pqLyndmvo7UU', 'provider': 'FoxSports'},
  //   {'link': 'http://feeds.feedburner.com/sportsblogs/sbnation.xml', 'provider': 'SBNation'},
  //   {'link': 'https://rss.cbssports.com/rss/headlines/', 'provider': 'CBSSports'},
  //   {'link': 'https://rss.cbssports.com/rss/headlines/', 'provider': 'CNNSports'},
  //   {'link': 'https://sports.yahoo.com/rss/', 'provider': 'Yahoo'},
  //   {'link': 'http://rssfeeds.usatoday.com/usatodaycomsports-topstories&x=1', 'provider': 'USA Today'}
  // ];

  // createJSON(techArr, 'technology.json', 0.5);
})();