import {BaseService} from '../../shared/services/base.service';
import {HttpHeaders} from 'aws-sdk/clients/iot';
import {UserRepository} from './user.repository';

export class UserService extends BaseService<any, any> {
  constructor(headers: HttpHeaders) {
    super(headers, new UserRepository());
  }



  delete(): Promise<any> {
    return Promise.resolve(undefined);
  }

  get({username}: {username: string}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!await this.authService.isAdmin()) {
        return reject(this.authService.getUnauthorizedResponse());
      }

      if (username) {
        this.getByUsername(username as string)
          .then(resolve)
          .catch(resolve);
      } else {
        (this.repository as UserRepository).getAll()
          .then(data => resolve(data as any))
          .catch(resolve);
      }
    });
  }

  getByUsername(username: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!await this.authService.isAdmin()) {
        return reject(this.authService.getUnauthorizedResponse());
      }

      (this.repository as UserRepository).getByUsername(username)
        .then(data => resolve(data as any))
        .catch(resolve);
    });
  }

  addUserToGroup(username: string, groupName: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!await this.authService.isAdmin()) {
        return reject(this.authService.getUnauthorizedResponse());
      }

      (this.repository as UserRepository).addUserToGroup(username, groupName)
        .then(data => resolve(data as any))
        .catch(resolve);
    });
  }

  patch(body: any): Promise<any> {
    return Promise.resolve(body);
  }

  post(body: any): Promise<any> {
    return Promise.resolve(body);
  }

  getAll() {
    return new Promise(async (resolve, reject) => {
      if (!await this.authService.isAdmin()) {
        return reject(this.authService.getUnauthorizedResponse());
      }
      (this.repository as UserRepository).getAll()
        .then(data => {
          resolve(data as any);
        })
        .catch(resolve);
    });
  }

  adminDeleteUser(username: string) {
    return new Promise(async (resolve, reject) => {
      if (!await this.authService.isAdmin() || !username) {
        return reject(this.authService.getUnauthorizedResponse());
      }
      (this.repository as UserRepository).adminDeleteUser(username)
        .then(data => {
          resolve(data as any);
        })
        .catch(resolve);
    });
  }

  updateEmail(email: string) {
    return (this.repository as UserRepository).updateEmail(this.authService.getToken(), email);
  }

  changePassword(previousPassword: string, proposedPassword: string) {
    return new Promise(async (resolve, reject) => {
      (this.repository as UserRepository).changePassword(this.authService.getToken(), previousPassword, proposedPassword)
        .then(data => {
          resolve(data as any);
        })
        .catch(reject);
    });
  }
}