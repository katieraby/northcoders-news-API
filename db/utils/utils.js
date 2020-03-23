exports.formatDates = list => {
  let newArray = list.map(obj => {
    let newDate = new Date(obj.created_at);
    return { ...obj, created_at: newDate };
  });
  return newArray;
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(item => {
    const key = item.title;
    const val = item.article_id;
    refObj[key] = val;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = comments.map(object => {
    const newObj = {
      ...object,
      article_id: object.belongs_to,
      author: object.created_by
    };
    newObj.article_id = articleRef[newObj.article_id];
    delete newObj.belongs_to;
    delete newObj.created_by;
    return newObj;
  });
  return this.formatDates(formattedComments);
};

//truncate articlebody
exports.truncateBody = bodyStr => {
  const ending = "...";
  const length = 200;
  if (bodyStr.length > length) {
    return bodyStr.substring(0, length - ending.length) + ending;
  } else {
    return bodyStr;
  }
};
