import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteImageAddComponent } from './delete-image-add.component';

describe('DeleteImageAddComponent', () => {
  let component: DeleteImageAddComponent;
  let fixture: ComponentFixture<DeleteImageAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteImageAddComponent]
    });
    fixture = TestBed.createComponent(DeleteImageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
