import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from './decorators/rawHeaders.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail:string,
    @RawHeaders() rawHeaders : string[]
  ){
    return {
      ok: true,
      message: 'Hola mundo Private',
      user,
      userEmail,
      rawHeaders
    }
  }
  // @SetMetadata('roles', ['admin', 'super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ){

    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(ValidRoles.superUser, ValidRoles.admin)
  privateRoute3(
    @GetUser() user: User
  ){

    return {
      ok: true,
      user
    }
  }
}
