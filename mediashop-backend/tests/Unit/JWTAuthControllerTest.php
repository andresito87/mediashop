<?php

namespace Tests\Unit\Unit;

use App\Mail\VerifiedMail;
use Illuminate\Foundation\Testing\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use PHPUnit\Framework\Attributes\Test;
use Tymon\JWTAuth\Facades\JWTAuth;

class JWTAuthControllerTest extends TestCase
{

    #[Test]
    public function a_user_can_register_successfully()
    {
        Mail::fake();

        $data = [
            'name' => 'John',
            'surname' => 'Doe',
            'phone' => '123456789',
            'email' => 'john.doe@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/auth/register', $data);

        $response->assertStatus(201)
            ->assertJsonStructure(['user', 'token']);

        $this->assertDatabaseHas('users', [
            'name' => $data['name'],
            'surname' => $data['surname'],
            'phone' => $data['phone'],
            'email' => $data['email'],
        ]);

        Mail::assertSent(VerifiedMail::class);

        $user = User::where('email', $data['email'])->first();
        $this->assertTrue(Hash::check($data['password'], $user->password));

        // using soft delete
        $user->delete();

        $this->assertNotNull($user->deleted_at);

        $this->assertDatabaseHas('users', [
            'email' => $data['email'],
        ]);

        $this->assertDatabaseHas('users', [
            'deleted_at' => $user->deleted_at,
        ]);

        // force user delete
        $user->forceDelete();
    }

    #[Test]
    public function a_user_can_update_password()
    {

        $user = User::create([
            'name' => 'John',
            'surname' => 'Doe2',
            'phone' => '123456789',
            'email' => 'john.doe2@example.com',
            'password' => Hash::make('oldpassword123'),
            'type_user' => 2, // user type
        ]);


        $token = JWTAuth::fromUser($user);


        $data = [
            'password' => 'newpassword123',
        ];


        $response = $this->postJson('/api/auth/update', $data, [
            'Authorization' => "Bearer $token"
        ]);


        $response->assertStatus(200);


        $user->refresh();
        $this->assertTrue(Hash::check($data['password'], $user->password));

        $user->forceDelete();
    }

    #[Test]
    public function a_user_can_login_successfully()
    {
        $user = User::create([
            'name' => 'John',
            'surname' => 'Doe',
            'phone' => '123456789',
            'email' => 'john.doe3@example.com',
            'password' => Hash::make('password123'),
            'type_user' => 2, // user type
        ]);

        $user->email_verified_at = now();
        $user->save();

        $data = [
            'email' => 'john.doe3@example.com',
            'password' => 'password123',
        ];

        $token = JWTAuth::fromUser($user);
        $response = $this->postJson('/api/auth/login', $data, [
            'Authorization' => "Bearer $token"
        ]);

        $response->assertStatus(200);

        $this->assertArrayHasKey('access_token', $response->json());

        $user->forceDelete();

    }

    #[Test]
    public function a_user_can_logout_successfully()
    {
        $user = User::create([
            'name' => 'John',
            'surname' => 'Doe',
            'phone' => '123456789',
            'email' => 'john.doe4@example.com',
            'password' => Hash::make('password123'),
            'type_user' => 2, // user type
        ]);

        $user->email_verified_at = now();
        $user->save();

        $data = [
            'email' => 'john.doe4@example.com',
            'password' => 'password123',
        ];

        $token = JWTAuth::fromUser($user);
        $response = $this->postJson('/api/auth/logout', [], [
            'Authorization' => "Bearer $token"
        ]);

        $response->assertStatus(200);

        $user->forceDelete();

    }

    #[Test]
    public function a_user_can_verify_email()
    {
        $user = User::create([
            'name' => 'John',
            'surname' => 'Doe',
            'phone' => '123456789',
            'email' => 'john.doe5@example.com',
            'password' => Hash::make('password123'),
            'type_user' => 2, // user type
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->postJson('/api/auth/verified_auth', [], [
            'Authorization' => "Bearer $token"
        ]);

        $response->assertStatus(200);

        $user->forceDelete();

    }

    #[Test]
    public function a_user_can_verify_code()
    {
        $user = User::create([
            'name' => 'John',
            'surname' => 'Doe',
            'phone' => '123456789',
            'email' => 'john.doe6@example.com',
            'password' => Hash::make('password123'),
            'type_user' => 2, // user type
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->postJson('/api/auth/verified_code', [], [
            'Authorization' => "Bearer $token"
        ]);

        $response->assertStatus(200);

        $user->forceDelete();

    }

    #[Test]
    public function a_admin_can_login_successfully()
    {
        $user = User::create([
            'name' => 'John',
            'surname' => 'Doe',
            'phone' => '123456789',
            'email' => 'john.doe7@example.com',
            'password' => Hash::make('password123'),
            'type_user' => 1, // admin type
        ]);

        $data = [
            'email' => 'john.doe7@example.com',
            'password' => 'password123',
        ];

        $token = JWTAuth::fromUser($user);
        $response = $this->postJson('/api/auth/admin_login', $data, [
            'Authorization' => "Bearer $token"
        ]);

        $response->assertStatus(200);

        $this->assertArrayHasKey('access_token', $response->json());

        $user->forceDelete();

    }

    #[Test]
    public function a_user_can_verify_password()
    {
        $user = User::create([
            'name' => 'John',
            'surname' => 'Doe',
            'phone' => '123456789',
            'email' => 'john.doe8@example.com',
            'password' => Hash::make('password123'),
            'type_user' => 2, // user type
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->postJson('/api/auth/verified_password', [], [
            'Authorization' => "Bearer $token"
        ]);

        $response->assertStatus(200);

        $user->forceDelete();

    }

    #[Test]
    public function get_user_info()
    {
        $user = User::create([
            'name' => 'John',
            'surname' => 'Doe',
            'phone' => '123456789',
            'email' => 'john.doe9@example.com',
            'password' => Hash::make('password123'),
            'type_user' => 2, // user type
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->getJson('/api/user', [
            'Authorization' => "Bearer $token"
        ]);

        $response->assertStatus(200);

        $this->assertArrayHasKey('user', $response->json());

        $user->forceDelete();

    }
}
