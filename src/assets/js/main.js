function formcheck(doc,type) {
  let res = true;
  var fields = $('#'+doc)
    .find("[required]:visible");

  $.each(fields, function(i, field) {
    if (!field.value) {
      res = false;
      if (type === 1) {
        alertify.error(field.name + ' is required');

      } else {
        alertify.error('all field is required');
      }
      return false;
    }

  });
  return res;
}
