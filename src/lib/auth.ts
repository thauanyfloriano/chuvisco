import { supabase } from './supabaseClient';

/**
 * Sistema de Autenticação com Token Assinado e Controle de Sessão no Banco
 * Utiliza HMAC-SHA256 e validação em tempo real contra o Supabase.
 */

const SECRET = import.meta.env.VITE_AUTH_SECRET || 'default_secret_key';
const enc = new TextEncoder();

async function getCryptoKey() {
    const keyData = enc.encode(SECRET);
    return await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
    );
}

/**
 * Gera um token assinado e registra a sessão no banco
 */
export async function generateToken(payload: { email: string }) {
    const sessionId = crypto.randomUUID();

    // Registra a nova sessão no banco de dados (Isso invalida automaticamente qualquer login anterior)
    const { error } = await supabase
        .from('profiles')
        .update({ current_session_id: sessionId })
        .match({ name: 'Naira Floriano' }); // Identificador do perfil Admin

    if (error) {
        console.error('Erro ao registrar sessão:', error);
        throw new Error('Falha ao registrar sessão no banco');
    }

    const now = Math.floor(Date.now() / 1000);
    const data = {
        ...payload,
        jti: sessionId, // ID único para este token específico
        iat: now,
        exp: now + (60 * 60 * 24), // Token vale por 24 horas
    };

    const encodedData = btoa(JSON.stringify(data));
    const key = await getCryptoKey();
    const signature = await crypto.subtle.sign('HMAC', key, enc.encode(encodedData));

    const signatureHex = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return `${encodedData}.${signatureHex}`;
}

/**
 * Valida o token e se a sessão ainda está ativa no banco
 */
export async function validateToken(token: string | null): Promise<boolean> {
    if (!token) return false;

    const [encodedData, signatureHex] = token.split('.');
    if (!encodedData || !signatureHex) return false;

    try {
        const key = await getCryptoKey();
        const sigBytes = new Uint8Array(signatureHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        const isValidSignature = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(encodedData));

        if (!isValidSignature) return false;

        const data = JSON.parse(atob(encodedData));
        const now = Math.floor(Date.now() / 1000);

        // 1. Checa expiração temporal
        if (data.exp && now > data.exp) return false;

        // 2. Checa se este token específico é o que está "ativo" no banco
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('current_session_id')
            .match({ name: 'Naira Floriano' })
            .single();

        if (error || !profile || profile.current_session_id !== data.jti) {
            console.warn('Este token foi invalidado por um novo login ou logout.');
            return false;
        }

        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Limpa a sessão no banco de dados (Logout Real)
 */
export async function invalidateSession() {
    await supabase
        .from('profiles')
        .update({ current_session_id: null })
        .match({ name: 'Naira Floriano' });
}
