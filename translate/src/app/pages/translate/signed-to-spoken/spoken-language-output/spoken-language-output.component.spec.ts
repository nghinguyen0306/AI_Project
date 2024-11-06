import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpokenLanguageOutputComponent } from './spoken-language-output.component';

describe('SpokenLanguageOutputComponent', () => {
  let component: SpokenLanguageOutputComponent;
  let fixture: ComponentFixture<SpokenLanguageOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpokenLanguageOutputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpokenLanguageOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
