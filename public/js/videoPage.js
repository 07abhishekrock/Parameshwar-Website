let categories = ['Bhakti' , 'Bhajan' , 'Arti' , 'Live'];
let videoList = new MyElement('div.album').init(true);
let videoLoader = new Loader(new MyElement('ul.video-tabs'));
let load_more_videos_button = new MyElement('button#load-more-videos').init(true);
console.log(load_more_videos_button);
let VideosDynamicList = new DynamicListComponent(videoList,`<div class="video-card">
  <img src="/img/$$">
  <div class="video-info">
    <h3>$$</h3>
    <div class="video-sub-info">
      <a href="/videos/$$"><i class="fas fa-play-circle"></i>Play Now</a>
      <span>$$</span>
    </div>
  </div>
</div>`,
'/api/v1/videos/','/api/v1/videos/',
['photo','name','_id','category']
).addLoader(videoLoader).addPaginationTrigger(load_more_videos_button).addSubOptions([
  {
    optionName : 'Bhakti',
    categoryParamValue : 0
  },
  {
    optionName : 'Bhajan',
    categoryParamValue : 1
  },
  {
    optionName : 'Arti',
    categoryParamValue : 2
  },
  {
    optionName : 'Live',
    categoryParamValue : 3
  }
] , 'ul.video-tabs');

VideosDynamicList.openDynamicList();