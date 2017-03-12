/**
 * Model superclass
 */
class Model {
  /**
   * Constructs a new instace of User with the provided options
   * @param {object} options - an object containing options in accordance with the schema
   */
  constructor(options) {
    assignFromSchema(options);
  }

  /**
   * Assigns the values in the options object to the instance only
   * if the key is present in the original schema
   */
  assignFromSchema(options) {
    // this.constructor.schema accesses the static schema
    // property, which is assigned in the implementing subclass
    Object.keys(this.constructor.schema).forEach((key) => {
      // Map each schema key to a key in the options object
      this[key] = options[key];
    });
  }
}

module.exports = Model;
