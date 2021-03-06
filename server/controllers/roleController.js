import model from '../models';

class roleController {

  /**
   * Method createRole
   * @param {Object} request - request Object
   * @param {Object} response - request Object
   * @return {Object} response Object
   */
  static createRole(request, response) {
    model.Role.sync();
    model.Role.create(request.body)
      .then(newRole => response.status(201).send(newRole))
      .catch(error => response.status(400).send(error.errors)
      );
  }

  /**
   * Method getRoles to obtain all roles
   * @param {Object} request - request Object
   * @param {Object} response - request Object
   * @return {Object} response Object
   */
  static getRoles(request, response) {
    const limit = request.query.limit || '10';
    const offset = request.query.offset || '0';
    model.Role.findAndCountAll({
      limit,
      offset,
      order: '"createdAt" ASC'
    })
      .then((roles) => {
        const data = limit && offset ? { totalCount: roles.count,
          pages: Math.ceil(roles.count / limit),
          currentPage: Math.floor(offset / limit) + 1,
          pageSize: roles.rows.length } : null;
        return response.status(200).send({ roles: roles.rows, data });
      });
  }

  // /**
  //  * Method updateRole
  //  * @param {Object} request - request Object
  //  * @param {Object} response - request Object
  //  * @return {Object} response object
  //  */
  // static updateRole(request, response) {
  //   model.Role.findById(request.params.id)
  //     .then((role) => {
  //       if (!role) {
  //         return response.status(404)
  //         .send({ message: `Ǹo role with id: ${request.params.role}` });
  //       }

  //       role.update(request.body)
  //         .then((updatedRole) => {
  //           return response.status(200)
  //             .send(updatedRole);
  //         });
  //     });
  // }

  // /**
  //  * Method deleteRole
  //  * @param {Object} request - request Object
  //  * @param {Object} response - request Object
  //  * @return {Object} response object
  //  */
  // static deleteRole(request, response) {
  //   model.Role.findById(request.params.id)
  //     .then((role) => {
  //       if (!role) {
  //         return response.status(404)
  //         .send({ message: `Ǹo role with id: ${request.params.role}` });
  //       }

  //       role.destroy()
  //         .then(() => {
  //           return response.status(200)
  //             .send({ message: 'Succesfully deleted role' });
  //         });
  //     });
  // }
}

export default roleController;
