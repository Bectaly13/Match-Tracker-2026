import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayedPage } from './played.page';

describe('PlayedPage', () => {
  let component: PlayedPage;
  let fixture: ComponentFixture<PlayedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
