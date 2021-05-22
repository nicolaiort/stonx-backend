import { Forbidden, NotFound } from "@tsed/exceptions";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../../models/entity/User";
import { UserCreation } from "../../models/UserCreation";
import { UserUpdating } from "../../models/UserUpdating";

/**
 * Provides standardized functions for interacting with the user entities in the db.
 */
@EntityRepository(User)
export class UserService extends Repository<User> {

  /**
   * Finds a user by their id.
   * @param id The user's id.
   * @returns The user or undefined wrapped in a Promise.
   */
  async findById(id: string): Promise<User | undefined> {
    return this.findOne({ id: id });
  }

  /**
   * Finds a user by their id or fails.
   * @param id The user's id.
   * @returns The user wrapped in a Promise.
   */
  async findByIdOrFail(id: string): Promise<User> {
    return this.findOneOrFail({ id: id });
  }

  /**
   * Finds a user by their email address.
   * @param email The user's email address.
   * @returns The user or undefined wrapped in a Promise.
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOne({ email: email });
  }

  /**
   * Finds a user by their username.
   * @param user The user's name.
   * @returns The user or undefined wrapped in a Promise.
   */
  async findByName(username: string): Promise<User | undefined> {
    return this.findOne({ username: username });
  }

  /**
   * Converts a UserCreation objecto into a User entity and saves it to the database.
   * @param new_user The new user.
   * @returns The user entity wrapped into a Promise.
   */
  async createUser(new_user: UserCreation): Promise<User> {
    let user = new User(new_user.email, new_user.username);
    await user.setPassword(new_user.password);
    return this.save(user);
  }

  /**
   * Increases a user's jwt count to effectively log them out.
   * @param user The user.
   */
  async increaseJwtCount(user: User) {
    user = await this.findOneOrFail(user);
    user.jwt_count = user.jwt_count + 1;
    await this.save(user);
  }

  /**
   * Updates a user identified by their email address.
   * @param email The email address of the user you want to update.
   * @param update_user The UpdateUser object used to update the user.
   * @returns The updated user entity wrapped into a Promise.
   */
  async updateByEmail(email: string, update_user: UserUpdating): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFound("User not found");
    }

    const user_email = await this.findByEmail(update_user.email);
    const user_name = await this.findByName(update_user.username);

    if (user_email && user_email?.id != user.id) {
      throw new Forbidden("Email is already registered");
    }
    if (user_name && user_name?.id != user.id) {
      throw new Forbidden("Username is already registered");
    }

    user.email = update_user.email;
    user.username = update_user.username;

    if (update_user.password) {
      await user.setPassword(update_user.password);
    }

    await this.save(user);
    return this.findByIdOrFail(user.id);
  }

  /**
   * Delete a user identified by their email address.
   * @param email The email address of the user that you want to delete.
   * @returns The deleted user entity or undefined wrapped into a Promise.
   */
  async deleteByEmail(email: string): Promise<User | undefined> {
    const user = await this.findByEmail(email);
    if (!user) {
      return undefined;
    }

    await this.delete(user);
    return user;
  }
}
