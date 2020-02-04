/* takes an array of objects,
returns new array.
Each item in array has its timestamp converted to a javascript date object */
exports.formatDates = list => {
  let newArray = list.map(obj => {
    let newDate = new Date(obj["created_at"]);
    return { ...obj, ["created_at"]: newDate };
  });
  return newArray;
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(item => {
    const key = item["title"];
    const val = item["article_id"];
    refObj[key] = val;
  });
  return refObj;
};

// take an array of comment objects(`comments`) and a reference object, and return a new array of formatted comments.

exports.formatComments = (comments, articleRef) => {
  const formattedComments = comments.map(object => {
    const newObj = {
      ...object,
      ["article_id"]: object["belongs_to"],
      ["author"]: object["created_by"]
    };
    newObj["article_id"] = articleRef[newObj["article_id"]];
    delete newObj["belongs_to"];
    delete newObj["created_by"];
    return newObj;
  });
  return this.formatDates(formattedComments);
};
