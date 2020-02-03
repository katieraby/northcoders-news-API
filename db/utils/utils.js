/* takes an array of objects,
returns new array.
Each item in array has its timestamp converted to a javascript date object */
exports.formatDates = list => {
  //map through list
  //declare const for miliseconds which is also list["created_at"]
  //
  return [];
};

exports.makeRefObj = (list, title, article_id) => {
  const refObj = {};
  if (list.length !== 0) {
    list.forEach(item => {
      const key = item[title];
      const val = item[article_id];
      refObj[key] = val;
    });
  }
  return refObj;
};

exports.formatComments = (comments, articleRef) => {};
