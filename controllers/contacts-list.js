exports.contacts_list = (req, res, next) => {
  Users.find({})
    .exec((err, contacts) => {
      if (err) {
        return next(err);
      }

      res.render('contacts-table', {contacts: contacts});
    })
}
