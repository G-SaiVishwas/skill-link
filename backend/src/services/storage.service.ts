import sharp from 'sharp';
import QRCode from 'qrcode';
import { config } from '../config';
import { supabaseService } from './supabase.service';
import { UPLOAD_LIMITS } from '../config/constants';

class StorageService {
  /**
   * Upload and optimize photo
   */
  async uploadPhoto(
    fileBuffer: Buffer,
    userId: string,
    filename: string
  ): Promise<string> {
    try {
      // Resize and optimize image
      const optimizedBuffer = await sharp(fileBuffer)
        .resize(UPLOAD_LIMITS.PHOTO.RESIZE_WIDTH, UPLOAD_LIMITS.PHOTO.RESIZE_HEIGHT, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Generate unique filename
      const timestamp = Date.now();
      const ext = filename.split('.').pop() || 'jpg';
      const path = `${userId}/${timestamp}.${ext}`;

      // Upload to Supabase Storage
      await supabaseService.uploadFile(
        config.storage.photosBucket,
        path,
        optimizedBuffer,
        'image/jpeg'
      );

      // Get public URL
      const publicUrl = supabaseService.getPublicUrl(
        config.storage.photosBucket,
        path
      );

      return publicUrl;
    } catch (error) {
      console.error('Photo upload error:', error);
      throw new Error('Failed to upload photo');
    }
  }

  /**
   * Upload voice file
   */
  async uploadVoice(
    fileBuffer: Buffer,
    userId: string,
    filename: string,
    contentType: string
  ): Promise<string> {
    try {
      // Check file size
      if (fileBuffer.length > UPLOAD_LIMITS.VOICE.MAX_SIZE) {
        throw new Error('Voice file too large');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const ext = filename.split('.').pop() || 'mp3';
      const path = `${userId}/${timestamp}.${ext}`;

      // Upload to Supabase Storage
      await supabaseService.uploadFile(
        config.storage.voicesBucket,
        path,
        fileBuffer,
        contentType
      );

      // Get public URL
      const publicUrl = supabaseService.getPublicUrl(
        config.storage.voicesBucket,
        path
      );

      return publicUrl;
    } catch (error) {
      console.error('Voice upload error:', error);
      throw new Error('Failed to upload voice file');
    }
  }

  /**
   * Generate QR code for skill card
   */
  async generateQRCode(url: string): Promise<string> {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      return qrDataUrl;
    } catch (error) {
      console.error('QR code generation error:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Validate file type
   */
  validateFileType(mimetype: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimetype);
  }

  /**
   * Validate file size
   */
  validateFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize;
  }
}

export const storageService = new StorageService();
