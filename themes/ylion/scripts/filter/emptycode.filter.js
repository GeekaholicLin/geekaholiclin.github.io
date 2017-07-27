function filterEmptyCodeLine (data) {
  data.content = data.content.replace(/<div class="line">\s*<\/div>/mg, '');
  if(data.title==='理清Java的IO(2)--流'){
    console.log(data.content);
    console.log(/<div class="line">\s*<\/div>/mg.test(data.content));
  }
  return data;
}

hexo.extend.filter.register('after_post_render', filterEmptyCodeLine);