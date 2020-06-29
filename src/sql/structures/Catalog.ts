/**
 * Class of the catalog that stores information about the
 * schemas contained and authorized users.
 */
export default class Catalog {
  private name: string;
  private schemas: string[];
  private authorized: string[];

  /**
   * Initialize a Catalog object with a name, list of schemas
   * and list o authorized users.
   * @param name
   * @param schemas
   * @param authorized
   */
  constructor(
    name: string,
    schemas: string[] = [],
    authorized: string[] = ['root']
  ) {
    this.name = name;
    this.schemas = schemas;
    this.authorized = authorized;
  }

  /**
   * @returns Return the catalog name
   */
  public getName(): string {
    return this.name;
  }

  /**
   * @returns Return the list of authorized users
   */
  public getAuthorizedUsers(): string[] {
    return this.authorized;
  }

  /**
   * @returns Return the list of schemas
   */
  public getSchemas(): string[] {
    return this.schemas;
  }

  /**
   * Search for a schema name and return true if the schema
   * is included in this catalog.
   * @param schemaName The schema name that will be searched
   * @returns true if the schema already exists in catalog and false if not.
   */
  public hasSchema(schemaName: string): boolean {
    return this.schemas.includes(schemaName);
  }

  /**
   * Return true if the user have permissions for operate in this catalog.
   * @param userName The user name that will be searched
   * @returns true if the user has authorization and false if not.
   */
  public hasPermission(userName: string): boolean {
    return this.authorized.includes(userName);
  }

  /**
   * Add a schema in the catalog and return true if completed with success
   * or return false if the schema already exists
   * @param schemaName The schema name that will be added to this catalog
   * @returns true if the schema has been added and false if not.
   */
  public addSchema(schemaName: string): boolean {
    if (this.hasSchema(schemaName)) {
      // Schema already exists
      return false;
    }
    this.schemas.push(schemaName);
    return true;
  }

  /**
   * Remove a schema from this catalog.
   * @param schemaName The schema name that will be removed from this catalog
   * @returns true if the schema has been deleted and false if not.
   */
  public removeSchema(schemaName: string): boolean {
    const i = this.schemas.indexOf(schemaName, 0);
    if (i > -1) {
      this.schemas.slice(i, 1);
      return true;
    }
    return false;
  }

  /**
   * Authorize a user in this catalog
   * @param userName The user that will be authorized in this catalog
   * @returns true if the user has been authorized or false if not
   */
  public authorizeUser(userName: string): boolean {
    if (this.hasPermission(userName)) {
      // User already has permission
      return false;
    }
    this.authorized.push(userName);
    return true;
  }

  /**
   * Remove a authorization in this catalog.
   * @param userName the user name that will be lost the authorization from this catalog.
   * @returns true if the user has no more authorization in this catalog or false if not.
   */
  public removeAuthorization(userName: string): boolean {
    // TODO: dont remove root
    const i = this.authorized.indexOf(userName, 0);
    if (i > -1) {
      // User don't have authorization
      this.authorized.slice(i, 1);
      return true;
    }
    return false;
  }
}
