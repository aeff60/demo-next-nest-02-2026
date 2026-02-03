import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-ldapauth';
import { UserService } from '../../user/user.service';

@Injectable()
export class LdapStrategy extends PassportStrategy(Strategy, 'ldap') {
  constructor(private userService: UserService) {
    super({
      server: {
        url: process.env.LDAP_URL || 'ldap://localhost:389',
        bindDN: process.env.LDAP_BIND_DN || 'cn=admin,dc=borntodev,dc=com',
        bindCredentials: process.env.LDAP_BIND_PASSWORD || 'admin123',
        searchBase: process.env.LDAP_SEARCH_BASE || 'dc=borntodev,dc=com',
        searchFilter: process.env.LDAP_SEARCH_FILTER || '(uid={{username}})',
      },
    });
  }

  async validate(user: any): Promise<any> {
    if (!user) {
      throw new UnauthorizedException('Invalid LDAP credentials');
    }

    const email = user.mail || user.uid + '@borntodev.com';
    let dbUser = await this.userService.findByEmail(email);

    if (!dbUser) {
      dbUser = await this.userService.createFromLdap({
        email: email,
        name: user.cn || user.displayName || user.uid,
      });
    }

    if (!dbUser || !dbUser.isActive) {
      throw new UnauthorizedException('User account is disabled');
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      ldapUser: true,
    };
  }
}
