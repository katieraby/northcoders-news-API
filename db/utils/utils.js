/* takes an array of objects,
returns new array.
Each item in array has its timestamp converted to a javascript date object */
exports.formatDates = list => {
  let newArray = list.map(obj => {
    let newDate = new Date(obj["created_at"]).toUTCString();
    return { ...obj, ["created_at"]: newDate };
  });
  return newArray;
};

exports.makeRefObj = (list, title, article_id) => {
  const refObj = {};
  list.forEach(item => {
    const key = item[title];
    const val = item[article_id];
    refObj[key] = val;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {};
