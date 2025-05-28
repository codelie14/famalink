import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, phone, speciality } = await request.json();

    // 1. Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          speciality: speciality,
        }
      }
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Échec de la création de l'utilisateur" },
        { status: 400 }
      );
    }

    try {
      // 2. Créer le profil médecin avec le client admin (contourne la RLS)
      const { error: profileError } = await supabaseAdmin.from('doctors').insert({
        id: authData.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        speciality: speciality,
      });

      if (profileError) {
        console.error("Erreur lors de la création du profil:", profileError);
        throw profileError;
      }

      return NextResponse.json(
        { 
          message: "Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.",
          user: authData.user
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Erreur lors de la création du profil:", error);
      
      // Tentative de suppression de l'utilisateur si la création du profil échoue
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (deleteError) {
        console.error("Erreur lors de la suppression de l'utilisateur:", deleteError);
      }
      
      return NextResponse.json(
        { error: "Erreur lors de la création du profil médecin: " + (error.message || JSON.stringify(error)) },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Erreur serveur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'inscription" },
      { status: 500 }
    );
  }
} 