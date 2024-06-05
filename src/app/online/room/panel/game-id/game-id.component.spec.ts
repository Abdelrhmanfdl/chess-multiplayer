import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameIdComponent } from './game-id.component';

describe('GameIdComponent', () => {
  let component: GameIdComponent;
  let fixture: ComponentFixture<GameIdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameIdComponent]
    });
    fixture = TestBed.createComponent(GameIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
