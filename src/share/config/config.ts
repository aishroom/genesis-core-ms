import { registerAs } from '@nestjs/config';

export default registerAs('configuration', () => ({
  PORT: parseInt(process.env.PORT, 10) || 80,
  JENKINSENDPOINT: process.env.JENKINSENDPOINT,
  USERJENKINS: process.env.USERJENKINS,
  TOKENJENKIN: process.env.TOKENJENKIN,
  BASEURLJENKINS: process.env.BASEURLJENKINS,
  INFOBUILDJENKINS: process.env.INFOBUILDJENKINS,
  GITHUBAPI: process.env.GITHUBAPI,
  GITHUBAPICOMP: process.env.GITHUBAPICOMP,
  GITHUBTOKEN: process.env.GITHUBTOKEN,
  USER_POOL_ID: process.env.USER_POOL_ID,
  CLIENT_ID: process.env.CLIENT_ID,
  AWS_REGION: process.env.AWS_REGION,
  AWS_COGNITO_AUTHORITY: process.env.AWS_COGNITO_AUTHORITY,
  URL_GENESIS: process.env.URL_GENESIS,
  DB_CONFIG: {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_DATABASE,
    TYPE: process.env.DB_TYPE,
  },
  AVAILABLE_PLATFORMS: [
    {
      ID: 1,
      NAME: 'Github',
      URL_DEPROVISIONING_SERVICE: `${process.env.DEPROVISIONING_SERVICE}/github/deprovisioning`,
      TOKEN: 'Arb0l1to-d3-n4v1dad',
    },
    {
      ID: 2,
      NAME: 'Jenkins',
      URL_DEPROVISIONING_SERVICE: `${process.env.DEPROVISIONING_SERVICE}/jenkins/deprovisioning`,
      TOKEN: 'L0k-t4r-0gar',
    },
  ],
  VALIDATION_USERS: {
    JENKINS_ENDPOINT: `${process.env.DEPROVISIONING_SERVICE}/jenkins/validate-emails`,
    GITHUB_ENDPOINT: `${process.env.DEPROVISIONING_SERVICE}/github/validate-emails`,
  },
}));

export const CONST_DATA = {
  APLICATION_NAME: 'GenesisCoreMS',
};

export const CONST_JENKINS = {
  ORGANIZATION: 'aishroom',
  JENKINSENDPOINT: `https://localhost:8080`,
  USER_JENKINS: 'danelmej@unicauca.edu.co',
  TOKEN_JENKIN: '',
};

export const CONST_GITHUB = {
  ORGANIZATION: 'aishroom',
  GITHUBAPI: 'https://api.github.com',
  TOKENGITHUB: '',
};

export const SECRET_KEY = {
  GITHUB: 'Arb0l1to-d3-n4v1dad',
  JENKINS: 'L0k-t4r-0gar',
};
