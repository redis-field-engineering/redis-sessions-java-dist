package org.example.testsessions;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.example.testsessions.models.Book;
import org.example.testsessions.models.Category;
import org.example.testsessions.repositories.BookRepository;
import org.example.testsessions.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.data.repository.init.ResourceReader;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.URI;
import java.nio.file.*;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Component
@Slf4j
public class StartupRunner implements ApplicationRunner {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<String> readJsonFilesFromResources(String folder) throws IOException {
        InputStream is = getClass().getResourceAsStream(folder);
        if (is == null) return Collections.emptyList();

        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        return reader.lines()
                .filter(line -> line.trim().endsWith(".json"))
                .map(line -> readResourceFile(folder + "/" + line.trim()))
                .collect(Collectors.toList());
    }

    private String readResourceFile(String resourcePath) {
        StringBuilder result = new StringBuilder();
        try (InputStream in = getClass().getResourceAsStream(resourcePath);
             BufferedReader reader = new BufferedReader(new InputStreamReader(in))) {
            reader.lines().forEach(result::append);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result.toString();
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {
        if(bookRepository.count() == 0){
            ObjectMapper mapper = new ObjectMapper();
            TypeReference<List<Book>> typeReference = new TypeReference<>() {
            };


//            ResourceReader rr = new ResourceReader();
//            try {
//                List<String> jsonFiles = rr.readJsonFilesFromResources("/data/books");
//                jsonFiles.forEach(System.out::println);
//            } catch (IOException e) {
//                e.printStackTrace();
//            }

            URI uri = getClass().getResource("/data/books").toURI();
            Path dataPath;
            if(uri.getScheme().equals("jar")){
                FileSystem fileSystem = FileSystems.newFileSystem(uri,Collections.<String,Object>emptyMap());
                dataPath = fileSystem.getPath("/data/books");
            } else{
                dataPath=Paths.get(uri);
            }


            List<Path> filePaths = Files.list(dataPath)
                    .filter(path->path.toString().endsWith(".json")).toList();

            log.info("Files: {}", filePaths.stream().map(Path::toString).collect(Collectors.joining(",")));

            Map<String, Category> categories = new HashMap<>();

            filePaths.forEach(file -> {
                try {
                    log.info(">>>> Processing Book File: " + file);
                    String fileName = file.getFileName().toString();
                    String categoryName = fileName.substring(0, fileName.lastIndexOf("_"));
                    log.info(">>>> Category: " + categoryName);

                    Category category;
                    if (!categories.containsKey(categoryName)) {
                        category = Category.builder().name(categoryName).build();
                        categoryRepository.save(category);
                        categories.put(categoryName, category);
                    } else {
                        category = categories.get(categoryName);
                    }

                    InputStream inputStream;
                    if(uri.getScheme().equals("file")){
                        inputStream = new FileInputStream(file.toString());
                    } else{
                        inputStream = getClass().getResourceAsStream(file.toString());
                    }

                    List<Book> books = mapper.readValue(inputStream, typeReference);
                    books.stream().forEach((book) -> {
                        book.addCategory(category);
                        bookRepository.save(book);
                    });
                    log.info(">>>> " + books.size() + " Books Saved!");
                } catch (IOException e) {
                    log.info("Unable to import books: " + e.getMessage());
                }
            });
        }
    }
}
