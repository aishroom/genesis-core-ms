import { Injectable } from '@nestjs/common';
import { CONST_JENKINS, SECRET_KEY } from '../share/config/config';
import { ResponseDTO } from '../share/dto/ResponseDTO';

@Injectable()
export class JenkinsService {
  axios = require('axios');

  async deleteUserOrg(email: string, secret: unknown): Promise<ResponseDTO> {
    const typesRoles = ['globalRoles', 'projectRoles', 'slaveRoles'];

    let responseService: ResponseDTO = {
      status: 404,
      message: {
        code: 'NOT_FOUND',
        message: 'User does not exist',
      },
    };

    if (secret != SECRET_KEY.JENKINS) {
      responseService = {
        status: 401,
        message: {
          code: 'Unauthorized',
          message: 'Authorization Required',
        },
      };
      return responseService;
    }
    let userInOrganization = false;

    try {
      const userInRoles = [];
      let usersData: any;
      for (const typeRol of typesRoles) {
        await this.getListUsersJenkins(typeRol).then(
          (data) => (usersData = data),
        );
        userInOrganization = await this.validateUser(email, usersData);
        if (userInOrganization) {
          userInRoles.push(typeRol);
        }
      }

      if (userInRoles.length > 0) {
        for (const typeRol of userInRoles) {
          responseService = await this.deprovisioning(email, typeRol);
        }
      }
    } catch (error) {
      const eMsg = `'Consumer fail to aws all service' Message: ${error.message}`;
      responseService = {
        status: error.response.status,
        message: {
          code: error.code,
          message: eMsg,
        },
      };
    }
    return responseService;
  }

  async deprovisioning(email: string, type: string): Promise<ResponseDTO> {
    let responseService: ResponseDTO;
    const configurationDelete = {
      method: 'post',
      url: `${CONST_JENKINS.JENKINSENDPOINT}/role-strategy/strategy/deleteSid?type=${type}&sid=${email}`,
      auth: {
        username: CONST_JENKINS.USER_JENKINS,
        password: CONST_JENKINS.TOKEN_JENKIN,
      },
    };
    await this.axios(configurationDelete)
      .then((response) => {
        if (response.status === 200) {
          responseService = {
            status: 200,
            message: {
              code: 'Ok',
              message: `User ${email} Deprovisioning from Jenkins - ${CONST_JENKINS.ORGANIZATION}`,
            },
          };
        }
      })
      .catch(function (error) {
        responseService = {
          status: error.response.status,
          message: {
            code: error.code,
            message: error.response.data.message,
            documentation_url: error.response.data.documentation_url,
          },
        };
      });
    return responseService;
  }

  async validateUser(email: string, usersData: unknown[]): Promise<boolean> {
    let userFound = false;

    if (usersData) {
      await Object.values(usersData).forEach((aa: string[]) => {
        if (aa.includes(email)) {
          userFound = true;
        }
      });
    }
    return userFound;
  }

  async getListUsersJenkins(type: string): Promise<unknown[]> {
    const configurationGet = {
      method: 'get',
      url: `${CONST_JENKINS.JENKINSENDPOINT}/role-strategy/strategy/getAllRoles?type=${type}`,
      auth: {
        username: CONST_JENKINS.USER_JENKINS,
        password: CONST_JENKINS.TOKEN_JENKIN,
      },
    };

    let usersData: any;

    await this.axios(configurationGet)
      .then((response) => {
        if (response.status === 200) {
          usersData = response.data;
        }
      })
      .catch(function (error) {
        console.log(error.message);
      });

    return usersData;
  }

  async validateUsersJenkins(
    usersEmails: string[],
    secret: unknown,
  ): Promise<ResponseDTO> {
    let responseService: ResponseDTO = {
      status: 400,
      message: {
        code: 'BAD_REQUEST',
        message:
          'The list of users does not contain any information in JENKINS service.',
      },
    };

    if (secret != SECRET_KEY.JENKINS) {
      return responseService;
    }

    if (usersEmails.length > 0) {
      const listResponse = {};

      let userInOrganization = false;
      let usersData: any;
      await this.getListUsersJenkins('globalRoles').then(
        (data) => (usersData = data),
      );
      for (const email of usersEmails) {
        userInOrganization = await this.validateUser(email, usersData);
        listResponse[email] = userInOrganization;
      }

      responseService = {
        status: 200,
        message: {
          status: 'OK',
          message: 'List of verified emails.',
          jenkins: listResponse,
        },
      };
    }
    return responseService;
  }
}
