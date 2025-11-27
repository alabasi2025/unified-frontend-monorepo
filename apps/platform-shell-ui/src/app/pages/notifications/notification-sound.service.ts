import { Injectable } from '@angular/core';
import { INotificationSoundService } from './notification.contracts';

/**
 * NotificationSoundService
 * 
 * @description
 * Service for playing notification sounds in the SEMOP ERP system.
 * Implements INotificationSoundService from API Contract.
 * Provides sound playback, volume control, and mute functionality.
 * 
 * @implements {INotificationSoundService}
 * @see notification.contracts.ts
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationSoundService implements INotificationSoundService {
  private audio: HTMLAudioElement | null = null;
  private currentVolume = 0.7; // Default volume (70%)
  private isMuted = false;

  // Sound file paths for different notification types
  private soundPaths = {
    info: '/assets/sounds/notification-info.mp3',
    success: '/assets/sounds/notification-success.mp3',
    warning: '/assets/sounds/notification-warning.mp3',
    error: '/assets/sounds/notification-error.mp3'
  };

  constructor() {
    // Initialize audio element
    this.audio = new Audio();
    this.audio.volume = this.currentVolume;
  }

  /**
   * Play notification sound based on type
   * @param type - Notification type
   */
  playSound(type: 'info' | 'success' | 'warning' | 'error'): void {
    if (this.isMuted || !this.audio) {
      return;
    }

    try {
      // Set the sound file based on type
      this.audio.src = this.soundPaths[type];
      this.audio.volume = this.currentVolume;

      // Play the sound
      const playPromise = this.audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Sound played successfully
            console.log(`Played ${type} notification sound`);
          })
          .catch((error) => {
            // Auto-play was prevented or error occurred
            console.warn('Sound playback failed:', error);
          });
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  /**
   * Set volume level
   * @param level - Volume level (0 to 1)
   */
  setVolume(level: number): void {
    // Validate volume level
    if (level < 0 || level > 1) {
      console.warn('Volume level must be between 0 and 1');
      return;
    }

    this.currentVolume = level;

    if (this.audio) {
      this.audio.volume = level;
    }

    console.log(`Volume set to ${Math.round(level * 100)}%`);
  }

  /**
   * Mute all notification sounds
   */
  mute(): void {
    this.isMuted = true;
    console.log('Notification sounds muted');
  }

  /**
   * Unmute notification sounds
   */
  unmute(): void {
    this.isMuted = false;
    console.log('Notification sounds unmuted');
  }

  /**
   * Get current mute status
   * @returns Current mute status
   */
  isSoundMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Get current volume level
   * @returns Current volume level (0 to 1)
   */
  getVolume(): number {
    return this.currentVolume;
  }

  /**
   * Test sound playback
   * Plays a test sound to verify audio is working
   */
  testSound(): void {
    this.playSound('info');
  }
}
