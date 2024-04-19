import { Post } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(private readonly db: PrismaService) {}

  async post(id: number): Promise<Post | null> {
    return this.db.post.findUnique({
      where: { id },
    });
  }

  async posts(query: { title?: string; content?: string }): Promise<Post[]> {
    const filtered = query.title || query.content;

    if (filtered) {
      return this.db.post.findMany({
        where: {
          OR: [
            { title: { contains: query.title } },
            { content: { contains: query.content } },
          ],
        },
      });
    }

    return this.db.post.findMany();
  }

  async searchPosts(query: string): Promise<Post[]> {
    return this.db.post.findMany({
      where: {
        OR: [{ title: { contains: query } }, { content: { contains: query } }],
      },
    });
  }

  async publishedPosts(): Promise<Post[]> {
    return this.db.post.findMany({
      where: { published: true },
    });
  }

  async createPost(data: {
    title: string;
    content: string;
    authorEmail: string;
  }): Promise<Post> {
    const { title, content, authorEmail } = data;

    return this.db.post.create({
      data: {
        title,
        content,
        author: { connect: { email: authorEmail } },
      },
    });
  }

  async updatePost(
    id: number,
    data: { title: string; content: string },
  ): Promise<Post> {
    return this.db.post.update({
      where: { id },
      data,
    });
  }

  async updatePublished(id: number) {
    return this.db.post.update({
      where: { id },
      data: { published: true },
    });
  }

  async deletePost(id: number): Promise<Post> {
    return this.db.post.delete({
      where: { id },
    });
  }
}
