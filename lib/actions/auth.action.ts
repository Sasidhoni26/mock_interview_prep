"use server"

import { auth, db } from "@/firebase/admin";
import {cookies} from "next/headers";


const ONE_WEEK = 60*60*24*7;
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;
    console.log(params)

    try {
        if(!db){
            console.log("========================");
            console.log("db not initialized ",db)

            console.log("========================")
            throw new Error("Database not initialized");


        }
        console.log(uid)
        console.log("UID", typeof uid)
        if (!uid) {
            console.log("Invalid UID");
            return;
        }

        console.log("UID:", uid);
        const docRef = db.collection('users').doc(`${uid}`);
        docRef.get()
            .then((doc) => {
                if (doc.exists) {
                    console.log('Document data:', doc.data());
                } else {
                    console.log('No such document!');
                }
            })
            .catch((error) => {
                console.log('Error getting document:', error);
            });
        const userRecord = await db.collection('users').doc(`${uid}`)?.get();

        console.log("userRecord")
        console.log(userRecord)

        if(userRecord?.exists){
            return {
                success: false,
                message: `User already exists. Please sign in instead`
            }
        }

        await db.collection('users').doc(uid)?.set({
            name,email
        })

        return {
            success: true,
            message: `Account created successfully. Please sign in.`,
        }

    } catch (error : any) {
        console.log(`Error creating a user `, error)

        if(error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use."
            }
        }
        console.log(`Error creating a user `, error)
        return {
            success: false,
            message: 'Error creating user ',
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    
    try {
        const userRecord = await auth.getUserByEmail(email);
        console.log(userRecord)

        if(!userRecord){
            return {
                success: false,
                message: `User does not exists. Create an account instead.`
            }
        };

        await setSessionCookie(idToken)

    } catch (e) {
        console.log(e);

        return {
            success: false,
            message: `Failed to log into an account.`
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: ONE_WEEK*1000,
    });
    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser() : Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie,true);

        const userRecord : User | null = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord) return null;

        return {
            ...userRecord,
            id: userRecord?.id
        } as User;
    }catch(err){
        console.log(err);

        return null
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}