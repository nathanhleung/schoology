interface ISchema {
  [key: string]: string,
}

/**
 * Schema superclass
 */
abstract class Schema implements ISchema {
  private static baseSchema: ISchema = {
    id: 'SERIAL PRIMARY KEY',
  };
  /**
   * Constructs a new instace of the Schema with the provided options
   * @param {ISchema} schema - an object containing the schema
   */
  constructor(schema: ISchema) {
    this.assignFromSchema(schema);
  }

  /**
   * Assigns the values in the options object to the instance only
   * if the key is present in the original schema
   * @param {ISchema} schema - an object containing options in accordance with the schema
   */
  private assignFromSchema(schema: ISchema) {
    const baseKeys = Object.keys(Schema.baseSchema);
    const schemaKeys = Object.keys(Schema.schema);
    const allKeys = [...baseKeys, ...schemaKeys];
    baseKeys.forEach((key) => {
      // Map each schema key to a key in the options object
      this[key] = schema[key];
    });
    // this.constructor.schema accesses the static schema
    // property, which is assigned in the implementing subclass
    schemaKeys.forEach((key) => {
      this[key] = schema[key];
    });
  }

  private checkSchema(keys) {
    const keyOccurrenceTable: { [key: string]: number }  = {};
    const duplicateKeys = [];
    keys.forEach(key => {
      if (typeof keyOccurrenceTable[key] === "undefined") {
        keyOccurrenceTable[key] = 1;
      } else {
        keyOccurrenceTable[key] += 1;
      }
    })
  }
}

module.exports = Model;
