import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { Post as PostModel, User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('post/:id')
  async getPostById(
    @Param('id') id: string,
  ): Promise<PostModel | BadRequestException> {
    const idParsed = parseInt(id, 10);

    if (isNaN(idParsed)) {
      return new BadRequestException('Invalid ID');
    }

    return this.postService.post(idParsed);
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.publishedPosts();
  }

  @Get('posts')
  async getPosts(
    @Query('title') title: string,
    @Query('content') content: string,
  ): Promise<PostModel[]> {
    return this.postService.posts({ title, content });
  }

  @Get('post/search/:query')
  async searchPosts(
    @Param('query') query: string,
  ): Promise<PostModel[] | BadRequestException> {
    if (!query) {
      return new BadRequestException('Invalid query');
    }

    return this.postService.searchPosts(query);
  }

  @Post('post')
  async createDraft(
    @Body() data: { title: string; content: string; authorEmail: string },
  ): Promise<PostModel> {
    return this.postService.createPost(data);
  }

  @Post('user')
  async signupUser(
    @Body() data: { name: string; email: string },
  ): Promise<User> {
    return this.userService.createUser(data);
  }

  @Put('publish/:id')
  async publishPost(
    @Param('id') id: string,
  ): Promise<PostModel | BadRequestException> {
    const idParsed = parseInt(id, 10);

    if (isNaN(idParsed)) {
      return new BadRequestException('Invalid ID');
    }

    return this.postService.updatePublished(idParsed);
  }

  @Delete('post/:id')
  async deletePost(
    @Param('id') id: string,
  ): Promise<PostModel | BadRequestException> {
    const idParsed = parseInt(id, 10);

    if (isNaN(idParsed)) {
      return new BadRequestException('Invalid ID');
    }

    return this.postService.deletePost(idParsed);
  }
}
