package ch.unisg.backend.domain;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.net.MalformedURLException;
import java.net.URL;

class RepoTests {

    private static URL url;

    @BeforeAll
    static void setupUrl() {
        try {
            url = new URL("https://www.example.com");
        } catch(MalformedURLException e) {
            System.out.println("URL is malformed");
        }
    }

    @Test
    void newRepoTest() {
        Repo repo = new Repo(url, null);
        assert(repo.getStatus().equals(Status.REGISTERED));
    }
}
