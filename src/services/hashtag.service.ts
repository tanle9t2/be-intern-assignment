import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Hashtag } from '../entities/Hashtag';

export class HashtagService {
  private hashtagRepository: Repository<Hashtag> = AppDataSource.getRepository(Hashtag);

  // Create
  async createHashtag(tagName: string): Promise<Hashtag> {
    if (!tagName) throw new Error('Tag name is required');
    const existingHashtag = await this.hashtagRepository.findOneBy({ tagName });
    if (existingHashtag) return existingHashtag; // Return existing to avoid duplicates
    const hashtag = this.hashtagRepository.create({ tagName });
    return this.hashtagRepository.save(hashtag);
  }

  // Read
  async findAllHashtags(): Promise<Hashtag[]> {
    return this.hashtagRepository.find();
  }

  async findHashtagById(id: number): Promise<Hashtag | null> {
    if (!id) throw new Error('Hashtag ID is required');
    return this.hashtagRepository.findOne({
      where: { id },
    });
  }

  // Update
  async updateHashtag(id: number, updates: Partial<Hashtag>): Promise<Hashtag | null> {
    if (!id) throw new Error('Hashtag ID is required');
    const hashtag = await this.hashtagRepository.findOneBy({ id });
    if (!hashtag) throw new Error('Hashtag not found');
    if (updates.tagName && (await this.hashtagRepository.findOneBy({ tagName: updates.tagName }))) {
      throw new Error('Tag name already exists');
    }
    await this.hashtagRepository.update(id, updates);
    return this.hashtagRepository.findOneBy({ id });
  }

  // Delete
  async deleteHashtag(id: number): Promise<void> {
    if (!id) throw new Error('Hashtag ID is required');
    const hashtag = await this.hashtagRepository.findOneBy({ id });
    if (!hashtag) throw new Error('Hashtag not found');
    await this.hashtagRepository.delete(id);
  }
}
